import {useCallback, useState} from 'react'
import { type FileWithPath, useDropzone} from 'react-dropzone'
import { Button } from '../ui/button';

type FileUploaderProps = {
    fieldChange: (FILES: File[]) => void;
    mediaURL: string;
}


const FileUploader = ({ fieldChange, mediaURL } : FileUploaderProps) => {
    const [file, setFile] = useState<File[]>([]);
    const [fileURL, setFileURL] = useState<string>(mediaURL);

    const onDrop = useCallback( (acceptedFiles: FileWithPath[]) => {
        setFile(acceptedFiles);
        fieldChange(acceptedFiles);
        setFileURL(URL.createObjectURL(acceptedFiles[0]));
    }, [file])

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png', '.svg']
        },
    })

    return (
        <div {...getRootProps()} className='flex flex-col flex-center bg-dark-3 rounded-xl cursor-pointer'>
        <input {...getInputProps()} className='cursor-pointer' />
        {
            fileURL ? (
                <>
                    <div className='flex flex-1 justify-center w-full p-5 lg:p-10'>
                        <img 
                            src={fileURL} 
                            alt="image"
                            className='file_uploader-image' 
                        />
                    </div>
                    <p className='file_uploader-label'>
                        click or drag to change the image
                    </p>
                </>
            ) : (
                <div className='file_uploader-box'>
                    <img src="/assets/icons/file-upload.svg" width={96} height={77} alt="file-upload" />
                    <h3 className='base-medium text-light-2 mb-2 mt-6'>Drag Photo Here</h3>
                    <span className='small-regular text-light-4 mb-6'>SVG, PNG, JPG, JPEG</span>
                    <Button className='shad-button_dark_4'>Browse Files</Button>
                </div>
            )
        }
        </div>
    )
}

export default FileUploader
