import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Plus, Edit2, Trash2, CheckCircle, Circle } from "lucide-react";

export default function AdminDashboard() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    country: "",
    city: "",
    region: "",
    services: [],
    agency_type: "Local",
    phone: "",
    email: "",
    whatsapp: "",
    website: "",
    price_level: "Medium",
    reliability_score: 4,
    description: "",
    is_verified: false,
  });

  const { data: agencies = [] } = useQuery({
    queryKey: ["travel_agencies"],
    queryFn: () => base44.entities.TravelAgency.list(),
    initialData: [],
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.TravelAgency.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["travel_agencies"] });
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.TravelAgency.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["travel_agencies"] });
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.TravelAgency.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["travel_agencies"] });
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      country: "",
      city: "",
      region: "",
      services: [],
      agency_type: "Local",
      phone: "",
      email: "",
      whatsapp: "",
      website: "",
      price_level: "Medium",
      reliability_score: 4,
      description: "",
      is_verified: false,
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      updateMutation.mutate({ id: editingId, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const toggleService = (service) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter((s) => s !== service)
        : [...prev.services, service],
    }));
  };

  const stats = [
    { label: "Total Agencies", value: agencies.length },
    { label: "Verified", value: agencies.filter((a) => a.is_verified).length },
    { label: "Flights", value: agencies.filter((a) => a.services?.includes("Flights")).length },
    { label: "Cargo", value: agencies.filter((a) => a.services?.includes("Cargo")).length },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#0B6E4F] text-white rounded-lg font-bold text-sm"
          >
            <Plus className="w-4 h-4" /> Add Agency
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white rounded-lg p-4 border border-gray-200">
              <p className="text-gray-500 text-sm">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
            <h2 className="text-lg font-bold mb-4">{editingId ? "Edit Agency" : "Add New Agency"}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Agency Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="px-4 py-2 border border-gray-200 rounded-lg outline-none"
                  required
                />
                <select
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="px-4 py-2 border border-gray-200 rounded-lg"
                >
                  <option>Somalia</option>
                  <option>Kenya</option>
                  <option>Ethiopia</option>
                  <option>UAE</option>
                </select>
                <input
                  type="text"
                  placeholder="City"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="px-4 py-2 border border-gray-200 rounded-lg outline-none"
                  required
                />
                <input
                  type="text"
                  placeholder="Phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="px-4 py-2 border border-gray-200 rounded-lg outline-none"
                  required
                />
              </div>

              {/* Services */}
              <div>
                <p className="text-sm font-bold mb-2">Services</p>
                <div className="flex flex-wrap gap-2">
                  {["Flights", "Cargo", "Visa", "Tours", "Hotel Booking"].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => toggleService(s)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-colors ${
                        formData.services.includes(s)
                          ? "bg-[#0B6E4F] text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <select
                  value={formData.price_level}
                  onChange={(e) => setFormData({ ...formData, price_level: e.target.value })}
                  className="px-4 py-2 border border-gray-200 rounded-lg"
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
                <input
                  type="number"
                  min="1"
                  max="5"
                  placeholder="Rating (1-5)"
                  value={formData.reliability_score}
                  onChange={(e) => setFormData({ ...formData, reliability_score: parseInt(e.target.value) })}
                  className="px-4 py-2 border border-gray-200 rounded-lg outline-none"
                />
              </div>

              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none"
                rows="3"
              />

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.is_verified}
                  onChange={(e) => setFormData({ ...formData, is_verified: e.target.checked })}
                  className="w-4 h-4"
                />
                <span className="text-sm font-bold">Verified Agency</span>
              </label>

              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-bold text-sm"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-[#0B6E4F] text-white rounded-lg font-bold text-sm">
                  {editingId ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Agencies Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-900">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-900">City</th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-900">Services</th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-900">Rating</th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-900">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {agencies.map((agency) => (
                  <tr key={agency.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-6 py-3 text-sm font-semibold text-gray-900">{agency.name}</td>
                    <td className="px-6 py-3 text-sm text-gray-600">{agency.city}</td>
                    <td className="px-6 py-3 text-sm text-gray-600">{agency.services?.join(", ")}</td>
                    <td className="px-6 py-3 text-sm font-bold text-amber-600">{agency.reliability_score}/5</td>
                    <td className="px-6 py-3">
                      <button
                        onClick={() =>
                          updateMutation.mutate({ id: agency.id, data: { is_verified: !agency.is_verified } })
                        }
                        className="flex items-center gap-1 text-xs font-bold"
                      >
                        {agency.is_verified ? (
                          <>
                            <CheckCircle className="w-4 h-4 text-green-600" /> Verified
                          </>
                        ) : (
                          <>
                            <Circle className="w-4 h-4 text-gray-400" /> Pending
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingId(agency.id);
                            setFormData(agency);
                            setShowForm(true);
                          }}
                          className="text-blue-600 hover:text-blue-800 font-bold text-xs"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteMutation.mutate(agency.id)}
                          className="text-red-600 hover:text-red-800 font-bold text-xs"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
