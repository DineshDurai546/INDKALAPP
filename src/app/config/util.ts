export class Utilities{

    public static isString(x: any): x is string{
        return typeof x === 'string';
    }

    public static isNumber(x: any): x is number{
        return typeof x === 'number';
    }

    public static isValidObject(x: any): boolean {
        if(x !== '' && x != undefined && x != null){
            return true;
        }
        return false;
    }

    public static isArray(x: any): x is string[]{
        if (x instanceof Array){
            return true;
        }
        else {
            return false;
        }
    }

    public static getUniqId(): string{
      return  Math.random().toString(36).substr(2, 9);
    }

    public static  makeStringArray(val): string[]{
        return  val.split(',');
    }

    public static commonSeparatedStr(val): string{
        let valStr = '';
        if (val.length > 0){
            valStr = val.join(', ');
        }
        return valStr;
    }
}
