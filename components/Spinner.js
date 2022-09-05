import Image from "next/image";

const Spinner = ({ width = 30, height = 30 }) => (
  <div className="flex justify-center flex-col mt-2">
    <Image
      className="animate-spin-slow"
      alt="image of a football"
      src="/ball.svg"
      height={width}
      width={height}
    />
  </div>
);

export default Spinner;
