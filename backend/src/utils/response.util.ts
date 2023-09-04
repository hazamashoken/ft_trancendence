export class ResponseUtil {
  static succeed(data: string, message?: string) {
    return {
      success: true,
      message: message ?? 'request succeed',
      data,
    };
  }
}
