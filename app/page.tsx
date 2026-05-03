import { motion } from "framer-motion";

export default function Home() {
  return (
    <main style={{
      height: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#0a0a0a",
      color: "white",
      fontFamily: "sans-serif"
    }}>
      
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{ textAlign: "center" }}
      >
        <h1 style={{
          fontSize: "3rem",
          marginBottom: "1rem"
        }}>
          Your Name
        </h1>

        <p style={{
          fontSize: "1.2rem",
          opacity: 0.7
        }}>
          I build clean, modern web experiences.
        </p>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          style={{
            marginTop: "2rem",
            padding: "0.8rem 1.5rem",
            borderRadius: "999px",
            border: "none",
            background: "white",
            color: "black",
            cursor: "pointer"
          }}
        >
          View My Work
        </motion.button>
      </motion.div>

    </main>
  );
}
            
