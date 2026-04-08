// =======================
// BASE DE LICENCIAS
// =======================

const licenses = [
  {
    user: "Juan Carlos",
    code: "ABC123",
    expiration: "2026-12-31"
  }
];

// =======================
// CALCULAR DÍAS RESTANTES
// =======================

function daysLeft(expiration) {
  const today = new Date();
  const exp = new Date(expiration);

  const diff = exp - today;

  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

// =======================
// BUSCAR LICENCIA
// =======================

function findLicense(code) {
  return licenses.find(l => l.code === code);
}

// =======================
// VALIDAR LICENCIA
// =======================

function validateLicense(code) {
  const license = findLicense(code);

  // ❌ No existe
  if (!license) {
    return { status: "invalid" };
  }

  const days = daysLeft(license.expiration);

  // ⛔ Expirada
  if (days < 0) {
    return { status: "expired", license };
  }

  // ✅ Válida
  return {
    status: "valid",
    license,
    days
  };
}
