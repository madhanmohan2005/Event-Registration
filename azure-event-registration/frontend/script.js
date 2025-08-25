// Frontend logic for Event Registration

const apiBaseUrl = "/api"; // Azure Static Web Apps will route to Functions

// Handle Registration Form Submission
const form = document.getElementById("registrationForm");
if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      phone: document.getElementById("phone").value,
      event: document.getElementById("event").value,
    };

    try {
      const res = await fetch(`${apiBaseUrl}/Register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      document.getElementById("message").innerText =
        res.ok ? "✅ Registration successful!" : `❌ ${result.error}`;
      form.reset();
    } catch (err) {
      document.getElementById("message").innerText =
        "❌ Error submitting form.";
      console.error(err);
    }
  });
}

// Admin Page - Load Registrations
const loadBtn = document.getElementById("loadRegistrations");
if (loadBtn) {
  loadBtn.addEventListener("click", async () => {
    try {
      const res = await fetch(`${apiBaseUrl}/GetRegistrations`);
      const registrations = await res.json();

      const tbody = document.querySelector("#registrationsTable tbody");
      tbody.innerHTML = "";

      registrations.forEach((reg) => {
        const row = `
          <tr>
            <td>${reg.name}</td>
            <td>${reg.email}</td>
            <td>${reg.phone}</td>
            <td>${reg.event}</td>
            <td>${new Date(reg.timestamp).toLocaleString()}</td>
          </tr>`;
        tbody.innerHTML += row;
      });
    } catch (err) {
      console.error("Error loading registrations:", err);
    }
  });
}

// Admin Page - Export CSV
const exportBtn = document.getElementById("exportCSV");
if (exportBtn) {
  exportBtn.addEventListener("click", () => {
    const rows = [];
    const table = document.querySelector("#registrationsTable");
    const trs = table.querySelectorAll("tr");

    trs.forEach((tr) => {
      const cells = Array.from(tr.querySelectorAll("th, td")).map(
        (td) => `"${td.innerText}"`
      );
      rows.push(cells.join(","));
    });

    const blob = new Blob([rows.join("\n")], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "registrations.csv";
    link.click();
  });
}
