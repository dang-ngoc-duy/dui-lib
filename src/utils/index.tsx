export const formatNumberV2 = (value: number | string | undefined, options = {dot: false, decimal: 2}) => {

    if (value === undefined) return '';
  
    let { dot = false, decimal } = options;
    typeof dot === 'boolean' || (dot = false);
  
    const separator = dot ? ',' : '.';
    const arr = value.toString().split('.');
    const before = arr[0];
    const after = arr[1];
    const first = before.startsWith('-') ? '-' : '';
  
    const formatBefore = before.replace('-', '').split('').reverse().map((c, i) => {
      return (i % 3 === 2 ? separator : '') + c;
    }).reverse().join('').replace(/^\./, '');
  
    let formatAfter = after;
  
    if (after && typeof decimal === 'number' && decimal >= 0){
      formatAfter = (+('.' + after)).toFixed(decimal).replace(/^0\.?/, '')
    }
    //const reData = first + [ formatBefore, formatAfter ].join(dot ? '.' : ',').replace(/,$/, '')
    // return reData.replace(',','').replace('.','') === '000' ? '0' : reData
    //return reData
    return first + [ formatBefore, formatAfter ].join(dot ? '.' : ',').replace(/^(,|\.)/, '').replace(/(,|\.)$/, '')
  }