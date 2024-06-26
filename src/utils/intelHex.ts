export function loadHex(source: string, target: Uint8Array) {
  for (const line of source.split('\n')) {
    if (line[0] === ':' && line.substr(7, 2) === '00') {
      const bytes = parseInt(line.substr(1, 2), 16);
      const addr = parseInt(line.substr(3, 4), 16);

      // console.log('loadHex', {
      //   line,
      //   bytes,
      //   addr,
      // });

      for (let i = 0; i < bytes; i++) {
        target[addr + i] = parseInt(line.substr(9 + i * 2, 2), 16);
        // console.log('loadHex', {
        //   index: addr + i,
        //   dataString: line.substr(9 + i * 2, 2)
        // });
      }
    }
  }

  // console.log('loadHex', {
  //   target,
  // })
}