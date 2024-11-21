const RewardSection = () => {
  return (
    <div>
      <div className="flex flex-col pt-2    ">
        <p className="  text-xs text-center">WEETH STAKING REWARDS</p>
        <div className="flex justify-around">
          <p className="text-xs  red ">APR</p>
          <p className="  text-4xl text-gray-700">|</p>
          <p className="text-xs ">TVL</p>
        </div>
        <div className="flex justify-around border border-[rgb(158,92,244)] border-2">
          {/* <div> <img src="" alt="" /><p>4.1T</p></div>
          <div> <img src="" alt="" /><p>TBD</p></div>
          <div> <img src="" alt="" /><p>4.01B</p></div> */}
          <div>
            <p>img</p>
            <p>4.1T</p>
          </div>
          <div>
            <p>img</p>
            <p>TBD</p>
          </div>
          <div>
            <p>img</p>
            <p>4.01B</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RewardSection;
