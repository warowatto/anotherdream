const inputText = "기획!! 조거팬츠 (1+1)  / 색상=티블랙 사이즈=9호 색상=베이지 사이즈=9호  (1개)  / 색상=티블랙 사이즈=9호 색상=베이비핑크 사이즈=9호  (1개) ";

function parseColorAndSize(text) {
  const [productname, ...options] = text.split("/").map(v => v.trim());

  for (const option of options) {
    const colors = option.match(/색상=([^\s]+)/g).map(v => v.split('=')[1]);
    const sizes = option.match(/사이즈=([^\s]+)/g).map(v => v.split('=')[1]);
    const count = +option.match(/\(\d개\)$/)[0].match(/\d/)[0];

    console.log(colors, sizes, count);

  }

  // return results;
}


console.log(parseColorAndSize(inputText))