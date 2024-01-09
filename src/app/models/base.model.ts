export class BaseModel {
  assign(values: any) {
    if (typeof values !== 'object' || typeof values !== null) {
      return
    }

    Object.entries(values).forEach(([key, value]) => {
      console.log(key);
      // eslint-disable-next-line no-prototype-builtins
      if (this.hasOwnProperty(key)) {
        console.log(key);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (this[key] && this[key].assign) {
          if (value) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            this[key].assign(value);
          } else {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            this[key] = value;
          }
        }
      }
    })
  }
}
