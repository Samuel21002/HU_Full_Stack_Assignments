const Searchform = ({value}) => {
    return(
        <>
            Find Countries: <input type="text" onChange={value}/>
        </>
    )
}

export default Searchform