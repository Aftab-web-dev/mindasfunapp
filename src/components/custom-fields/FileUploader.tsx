// import React from "react";

// import Typography from "@mui/material/Typography";
// import { Controller } from "react-hook-form";

// import DropzoneWrapper from "@/@core/styles/libs/react-dropzone";

// import FileUploaderSingle from "@/views/forms/form-elements/file-uploader/FileUploaderSingle";

// const FileUploader = ({
//   control,
//   errors,
//   name,
//   label,
//   width,
// }: {

//   // register: any;
//   control: any;
//   errors: any;
//   name: string;
//   label?: string;
//   width?: number;
// }) => {
//   return (
//     <DropzoneWrapper width={width}>
//       <Typography variant="h6" sx={{ mb: 2.5 }}>
//         {label}
//         {!!errors[name] && (
//           <span style={{ color: "red", fontSize: "14px" }}>
//             Invalid File Format {!!errors[name]}
//           </span>
//         )}
//       </Typography>
//       <Controller
//         name={name}
//         control={control}
//         defaultValue=""
//         render={({ field }) => (
//           <div>
//             <FileUploaderSingle
//               file={field.value}
//               setFile={field.onChange}
//               error={errors[name]}
//             />
//           </div>
//         )}
//       />
//     </DropzoneWrapper>
//   );
// };

// export default FileUploader;
