interface TooltipProps {
    label: string;
    children: React.ReactNode;
}

const Tooltip = ({ label, children }: TooltipProps) => {
    return (
        <div className="relative group">
            {children}
            <span className="
        absolute -top-8 left-1/2 -translate-x-1/2
        scale-0 group-hover:scale-100
        transition-transform
        bg-black text-white text-xs px-2 py-1 rounded
        whitespace-nowrap
        z-10
      ">
                {label}
            </span>
        </div>
    );
};

export default Tooltip;