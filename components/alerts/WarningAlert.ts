import Swal from 'sweetalert2';

export default function WarningAlert() {
  let Userchoice = false;
  Swal.fire({
    title: 'Are you sure ',
    text: 'You want to create new workout plan!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes!',
  }).then((result) => {
    if (result.isConfirmed) {
      Userchoice = true;
      Swal.fire({
        title: 'Successs!',
        text: 'Workout is sucssfully created.',
        icon: 'success',
      });
    }
  });
  // return a state var where the result of the user choic is saved
  return Userchoice;
}
