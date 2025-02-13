// components/common/alerts/confirmAction.ts

import Swal, { SweetAlertResult } from 'sweetalert2';

/**
 * Displays a confirmation dialog with customizable title and text.
 *
 * @param title - The title of the confirmation dialog.
 * @param text - The message/body of the confirmation dialog.
 * @returns A promise that resolves to `true` if confirmed, otherwise `false`.
 */
export const confirmAction = async (
  title: string,
  text: string
): Promise<boolean> => {
  const result: SweetAlertResult = await Swal.fire({
    title,
    text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, proceed!',
    cancelButtonText: 'No, cancel',
  });

  return result.isConfirmed;
};
