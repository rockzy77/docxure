

const CustomInput = ({type, placeholder, icon, onChange, value, disabled}) => {
    return <div className="cinput">
        <input disabled={disabled} onChange={(e)=>{
            onChange(e.target.value)
        }} type={type} value={value} placeholder={placeholder} />
        {icon}
    </div>
}

export default CustomInput;