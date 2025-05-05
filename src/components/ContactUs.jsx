import NavBar from "./NavBar"


export const ContactUs = () => {
    return <div style={{
        height: '100vh',
        width: '100vw',
    }}>
        <NavBar />

        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            width: '100%',
            flexDirection: 'column'
        }}>
            <div style={{
                width: '40%',
                padding: 20,
                borderRadius: 10,
                color: '#fff',
                backgroundColor: '#2d9b74',
            }}>
                <h1 style={{
                    textAlign: 'center'
                }}>Contact Us</h1>

                <br />

                <label style={{
                    display: 'flex',
                    gap: 20,
                }} htmlFor="Name">
                    Name
                    <input style={{
                        flex: 1,
                        padding: 5,
                        position: 'relative',
                        bottom: 15,
                        marginTop: 10,
                        border: 'none',
                        outline: 'none',
                        borderBottom: '1px solid #fff',
                        color: '#fff',
                        backgroundColor: 'transparent'
                    }} type="text" id="Name" />
                </label>

                <br />

                <label style={{
                    display: 'flex',
                    gap: 20,
                }} htmlFor="Name">
                    Email
                    <input style={{
                        flex: 1,
                        padding: 5,
                        position: 'relative',
                        bottom: 15,
                        marginTop: 10,
                        border: 'none',
                        outline: 'none',
                        borderBottom: '1px solid #fff',
                        color: '#fff',
                        backgroundColor: 'transparent'
                    }} type="text" id="Name" />
                </label>

                <br />

                <label style={{
                    display: 'flex',
                    gap: 20,
                }} htmlFor="Name">
                    Message
                    <textarea style={{
                        flex: 1,
                        padding: '5px 5px',
                        position: 'relative',
                        bottom: 15,
                        height: 100,
                        marginTop: 10,
                        outline: 'none',
                        border: '1px solid #fff',
                        color: '#fff',
                        backgroundColor: 'transparent'
                    }} type="text" id="Name" >      </textarea>
                </label>

                <br />

                <button onClick={()=>{
                    alert('Message sent successfully')
                }} style={{
                    padding: '10px 20px',
                    border: 'none',
                    outline: 'none',
                    width: '100%',
                    backgroundColor: '#fff',
                    color: '#2d9b74',
                    cursor: 'pointer',
                    borderRadius: 5
                }}>Submit</button>
            </div>
    </div>
    </div>
}