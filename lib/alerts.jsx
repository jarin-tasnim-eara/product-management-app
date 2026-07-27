import Swal from "sweetalert2";

const baseConfig = {
  confirmButtonColor: "#6E7A52",
  cancelButtonColor: "#B5573F",
};

export function showSuccess(message) {
  return Swal.fire({
    icon: "success",
    title: message,
    timer: 2000,
    showConfirmButton: false,
    ...baseConfig,
  });
}

export function showError(message) {
  return Swal.fire({
    icon: "error",
    title: "Oops!",
    text: message,
    ...baseConfig,
  });
}

export async function confirmAction(message) {
  const result = await Swal.fire({
    icon: "warning",
    title: message,
    showCancelButton: true,
    confirmButtonText: "Yes",
    cancelButtonText: "Cancel",
    ...baseConfig,
  });
  return result.isConfirmed;
}