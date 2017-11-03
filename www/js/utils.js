//Validar e-mail
function validateEmail($email) {
  var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
  return emailReg.test( $email );
}
//if( !validateEmail(emailaddress)) { /* do stuff here */ }

