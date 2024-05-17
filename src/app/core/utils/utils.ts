
export class CommonUtils {
  public static isMobile(): boolean {
    if (window.outerWidth < 768) {
      return true;
    }
    return false;
  }
}