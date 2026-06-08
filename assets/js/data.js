// Static snapshot of content that was previously rendered from PHP/MySQL.
// Keep this file temporary until the static frontend is wired to a public API.
window.PORTFOLIO_DATA = {
  // Set the first value to your hosted PHP backend URL when backend/admin is deployed separately.
  // Local URLs work only in your own browser; public visitors need a public backend URL.
  backendBaseUrl: "http://127.0.0.1:8000",
  backendBaseUrls: [
    "http://127.0.0.1:8000",
    "http://localhost:8000",
    "http://127.0.0.1:8011",
    "http://localhost:8011",
    "http://localhost/my-portfolio",
    "http://127.0.0.1/my-portfolio"
  ],
  liveContentEndpoint: "/api/frontend-html.php",
  siteName: "Portfolio CMS",
  ownerName: "Mantu Kumar Singh",
  role: "Web Developer",
  contactEmail: "amantusingh4429@gmail.com",
  location: "Remote / India",
  primaryColor: "#076588",
  stats: {
    projects: 5,
    experienceYears: 2,
    skills: 5,
    teamMembers: 4
  },
  sections: ["about", "skills", "projects", "team", "experience", "testimonials", "contact"]
};
