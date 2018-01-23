export const middleware = promise => promise
  .then(
    (response) => {
      try {
        return response.json();
      } catch (e) {
        return response.body;
      }
    },
    (response) => {
      if (response.isCanceled) {
        return {
          error: response.error,
          isCanceled: true,
        };
      }

      let errorMessage = 'Server Error';

      switch (response.code) {
        case 500:
          console.warn('Server Error, 500');
          break;
        case 404:
          console.warn('404');
          break;
        default:
          try {
            errorMessage = response.json();
            console.warn('error', errorMessage);
          } catch (error) {
            console.warn('error', error);
          }
      }

      return {
        code: response.code,
        error: errorMessage,
      };
    },
  );

export default middleware;
