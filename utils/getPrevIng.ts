/**이미지 미리보기*/
export function getPrevImg(file: any, setter: any) {
  if (file && file.length > 0) {
    const actualFile = file[0];
    const reader = new FileReader();
    reader.readAsDataURL(actualFile);
    reader.onload = () => {
      setter(reader.result);
    };
  }
}
