export default  {
    crd: (size: number, percent: number, offset = 0) => {
        return (size * (percent / 100)) - offset;
    }
}
