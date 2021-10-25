export default {
  success: (status: number, msg: string, data: Object) => {
    return {
      status,
      data: {
        success: true,
        msg: msg,
        data: data,
      },
    };
  },
  fail: (status: number, msg: string) => {
    return {
      status,
      data: {
        success: false,
        msg: msg,
      },
    };
  },
};
