interface CartIconProps {
  count?: number;
}

const CartIcon = ({ count = 0 }: CartIconProps) => {
  return (
    <div className="relative">
      <svg
        width="26"
        height="26"
        viewBox="0 0 34 34"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M11.3333 14.1667H7.08333L4.25 29.75H29.75L26.9167 14.1667H22.6667M11.3333 14.1667V9.91667C11.3333 6.78705 13.8704 4.25 17 4.25V4.25C20.1296 4.25 22.6667 6.78705 22.6667 9.91667V14.1667M11.3333 14.1667H22.6667M11.3333 14.1667V18.4167M22.6667 14.1667V18.4167"
          stroke="#212121"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {count > 0 && (
        <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs font-semibold rounded-full h-5 w-5 flex items-center justify-center">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </div>
  );
};

export default CartIcon;
