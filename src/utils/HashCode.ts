export const convertToHashCode = (str: string): number => {
     let hash = 0;
    const toString = str;
    for (var i = 0; i < toString.length; i++) {
      let code = toString.charCodeAt(i);
      hash = (hash << 5) - hash + code;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
}