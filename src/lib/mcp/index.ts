import { auth, defineMcp } from "@lovable.dev/mcp-js";
import searchVendors from "./tools/search-vendors";
import getVendor from "./tools/get-vendor";
import searchListings from "./tools/search-listings";
import searchHospitals from "./tools/search-hospitals";
import listMyBookings from "./tools/list-my-bookings";
import listMyVendorPosts from "./tools/list-my-vendor-posts";

const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "somalia-connect",
  title: "Somalia Connect",
  version: "0.1.0",
  instructions:
    "Tools for MaalsoorHub, a Somali marketplace. Use search_vendors and search_listings to find businesses and offers, get_vendor for a full vendor profile, search_hospitals for the health directory, and list_my_bookings / list_my_vendor_posts for the signed-in user's own data.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [searchVendors, getVendor, searchListings, searchHospitals, listMyBookings, listMyVendorPosts],
});
