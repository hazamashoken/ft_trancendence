export class ResponseUtil {
  static succeed(data: string, message?: string) {
    return {
      success: true,
      message: message ?? 'request succeed',
      data,
    };
  }

  static errorDatabase({ code, message, detail }: any) {
    return { code, message, detail };
  }

  static sleep(s: number) {
    return new Promise((res) => setTimeout(() => {}, s * 1000));
  }

  static msleep(ms: number) {
    return new Promise((res) => setTimeout(() => {}, ms));
  }
}
