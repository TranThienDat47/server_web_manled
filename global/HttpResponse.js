export class HttpResponse {
   constructor(data = null, statusCode = 0, message = '') {
      this.data = data;
      this.statusCode = statusCode;
      this.message = message;

      return this;
   }
}
