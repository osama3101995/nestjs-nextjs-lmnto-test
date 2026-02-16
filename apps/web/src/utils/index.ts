export class DateUtils {
  static format(date: string | Date) {
    return new Date(date).toLocaleDateString();
  }
}

export class Pagination {
  static paginate<T>(arr: T[], page = 1, perPage = 10): T[] {
    const start = (page - 1) * perPage;
    return arr.slice(start, start + perPage);
  }
}
