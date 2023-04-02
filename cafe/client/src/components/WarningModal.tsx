// material ui
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

// utils

interface WarningModalProps {
  message: string;
  accept: () => void;
  reject: () => void;
}

const WarningModal = ({ message, accept, reject }: WarningModalProps) => {
  return (
    <Modal open={true} onClose={reject}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          padding: "24px",
          bgcolor: "#ffffff",
          color: "#333333",
          borderRadius: "8px",
          width: "calc(100% - 24px)",
          maxWidth: "400px",
          textAlign: "center",
        }}
      >
        <Typography id="modal-modal-title" variant="h4" mb={4}>
          {message}
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Button
            variant="contained"
            sx={{
              color: "#ffffff",
              fontSize: "16px",
              fontWeight: "bold",
              borderRadius: "4px",
              letterSpacing: "1px",
              border: "2px solid #333",
              bgcolor: "#333",
              boxShadow: 4,
              transition: "all 0.5s ease-in-out",
              "&:hover": {
                boxShadow: 2,
                backgroundColor: "#be9063",
              },
            }}
            onClick={() => accept()}
          >
            YES
          </Button>

          <Button
            onClick={() => reject()}
            variant="outlined"
            sx={{
              ml: 3,
              color: "#333333",
              fontSize: "16px",
              fontWeight: "bold",
              borderRadius: "4px",
              letterSpacing: "1px",
              border: "2px solid #333",
              boxSizing: "border-box",
              boxShadow: 4,
              transition: "all 0.5s ease-in-out",
              "&:hover": {
                boxShadow: 2,
                border: "2px solid #333",
                bgcolor: "#be9063",
                color: "#ffffff",
              },
            }}
          >
            CANCEL
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default WarningModal;
