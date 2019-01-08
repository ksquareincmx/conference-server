export const getDateStyles = function() {
  return {
    dateContainer: {
      display: "flex",
      flexDirection: "column"
    },
    labels: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      marginLeft: 10,
      marginRight: 10
    },
    text: {
      fontWeight: "bold"
    },
    dateValuesContainer: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 10,
      marginLeft: 10,
      marginRight: 10
    }
  };
};

export const getCardStyles = function() {
  return {
    cardContainer: {
      display: "flex",
      flexDirection: "column",
      height: 300,
      width: 230,
      backgroundColor: "#EAE8E8"
    }
  };
};

export const getButtonStyles = function() {
  return {
    button: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      marginTop: 10,
      height: 30,
      width: 160,
      backgroundColor: "#7ED321",
      textAlign: "center",
      color: "white"
    },

    buttonGrid: {
      display: "flex",
      justifyContent: "center"
    }
  };
};

export const getReasonStyles = function() {
  return {
    reasonAppointment: {
      fontWeight: "bold",
      marginLeft: 10
    }
  };
};

export const getTimeStyles = function() {
  return {
    timeContainer: {
      display: "flex",
      flexDirection: "row",
      marginBottom: 10
    },
    p: {
      marginLeft: 10
    },
    text: {
      fontWeight: "bold"
    }
  };
};
