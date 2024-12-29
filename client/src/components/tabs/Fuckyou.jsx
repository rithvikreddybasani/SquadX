function Fuckyou() {
    return (
        <div style={{
            width: "100vw", 
            height: "100vh", 
            margin: 0, 
            padding: 0, 
            position: "relative", 
            overflow: "hidden" // Prevent scrolling issues
        }}>
            <iframe
                src="https://algorithm-visualizer.org"
                width="100%"
                height="100%"
                style={{
                    border: "none",
                    position: "absolute",
                    top: "0",
                    left: "0",
                    zIndex: 1,
                    objectFit: "cover" // Ensures the iframe covers the area without distortion
                }}
                title="Algorithm Visualizer"
            ></iframe>
        </div>
    );
}

export default Fuckyou;
