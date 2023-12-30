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
}
