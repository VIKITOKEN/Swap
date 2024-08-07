import { FaTelegram, FaTwitter, FaDiscord } from "react-icons/fa";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="flex flex-col my-10 items-center min-h-[calc(100vh-431px)]">
      <div className="text-center">
        <span
          data-aos="flip-up"
          className="bg-neutral-900 text-white rounded-full h-8 text-medium font-medium px-2 py-1 uppercase"
        >
          Community
        </span>
        <div className=" relative w-full top-20 mt-0 transform -translate-y-1/2 text-2xl sm:text-4xl lg:text-7xl text-center tracking-wide text-white">
          <span className="bg-gradient-to-r from-orange-500 to-orange-600 text-transparent bg-clip-text">
            VIKING MULTI-DEX
          </span>
        </div>
        <div className="items-center mt-20 text-[16px] text-center text-white-100 max-w-[420px] mx-auto px-3">
        You can follow us on social media to follow the developments closely, 
        for technical support and to be a part of the Viking community!
        </div>

        {/* Social media icons */}
        <div className="flex justify-center mt-10 gap-10 opacity-70">
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://t.me/viking_swap"
            className="text-orange-50 hover:text-orange-50 neon-button py-3 px-4 rounded-full"
          >
            <FaTelegram className="h-8 w-8" />
          </a>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://x.com/viking_swap"
            className="text-orange-50 hover:text-orange-50 neon-button py-3 px-4 rounded-full"
          >
            <FaTwitter className="h-8 w-8" />
          </a>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://discord.com/invite/your_discord_invite"
            className="text-orange-50 hover:text-orange-50 neon-button py-3 px-4 rounded-full"
          >
            <FaDiscord className="h-8 w-8" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Index;
