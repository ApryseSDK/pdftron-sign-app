import emailjs from 'emailjs-com';

export const sendDocumentReadyToSign = async (assignees, email) => {
  emailjs.init(process.env.REACT_APP_EMAILJS_USER_ID);

  assignees.forEach((assignee) => {
    const templateParams = {
      to_name: assignee.name,
      to_email: assignee.email,
      from_email: email,
      message: 'Link coming soon...',
    };

    emailjs
      .send(
        process.env.REACT_APP_EMAILJS_SERVICE_ID,
        process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
        templateParams
      )
      .then(
        function (response) {
          console.log('SUCCESS!', response.status, response.text);
        },
        function (error) {
          console.log('FAILED...', error);
        }
      );
  });
};

export const sendDocumentSigned = async (assignees, email) => {
    emailjs.init(process.env.REACT_APP_EMAILJS_USER_ID);
  
    assignees.forEach((assignee) => {
      const templateParams = {
        to_name: assignee.name,
        to_email: assignee.email,
        from_email: email,
      };
  
      emailjs
        .send(
          process.env.REACT_APP_EMAILJS_SERVICE_ID,
          process.env.REACT_APP_EMAILJS_TEMPLATE_ID_COMPLETED,
          templateParams
        )
        .then(
          function (response) {
            console.log('SUCCESS!', response.status, response.text);
          },
          function (error) {
            console.log('FAILED...', error);
          }
        );
    });
  };
