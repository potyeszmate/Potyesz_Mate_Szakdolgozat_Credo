import * as ImageManipulator from 'expo-image-manipulator';

export const resizeImage = async (uri: string) => {
    try {
        const result = await ImageManipulator.manipulateAsync(
            uri,
            [{ resize: { width: 800 } }],
            { compress: 0.7, format: ImageManipulator.SaveFormat.PNG }
        );
        return result.uri;
    } catch (error) {
        console.error("Error resizing image:", error);
        return uri;
    }
  };