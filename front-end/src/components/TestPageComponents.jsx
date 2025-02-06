export const Boxes=({color, name})=>{
    return (
        <div className='flex '>
            <div
                className={`${color} box-content size-5 rounded-md p-2 mr-3`}
            ></div>
            <h1>{name}</h1>
        </div>
    )
}
