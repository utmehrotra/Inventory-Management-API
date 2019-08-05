export default function promiseWrapper(promise) {
    return promise
        .then((data) => {
          return [null, data];
        })
        .catch((err) => [err]);
};

