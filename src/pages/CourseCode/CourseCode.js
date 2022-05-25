import Grid from "@mui/material/Grid";
import AddCourseCodeCard from "./AddCourseCodeCard";

const CourseCode = () => {
  return (
    <Grid
      container
      direction="column"
      sx={{ width: "100%", alignItems: "center", padding: "2em" }}
    >
      <Grid>
        <AddCourseCodeCard />
      </Grid>
    </Grid>
  );
};

export default CourseCode;
