
export const successResponse = () => (
  new Promise((resolve) => {
    resolve({ json: () => 'works' });
  })
);

export default successResponse;
