import { useEffect, useState } from "react";
import { Keyboard } from "react-native";

export default function useKeyboardOffsetHeight()  {
    const [keyboardOffsetHeight, setKeyboardOffsetHeight] = useState<number>(0)
    
    useEffect(() => {
        const keyboardWillAndroidShowListener = Keyboard.addListener(
            'keyboardWillShow',
            e => {
                setKeyboardOffsetHeight(e.endCoordinates.height)
            }
        )
        const keyboardWillAndroidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            e => {
                setKeyboardOffsetHeight(0)
            }
        )
        const keyboardWillShowListener = Keyboard.addListener(
            'keyboardWillShow',
            e => {
                setKeyboardOffsetHeight(e.endCoordinates.height)
            }
        )
        
        const keyboardWillHideListener = Keyboard.addListener(
            'keyboardDidHide',
            e => {
                setKeyboardOffsetHeight(0)
            }
        )

        return () => {
            keyboardWillAndroidShowListener.remove()
            keyboardWillAndroidHideListener.remove()
            keyboardWillShowListener.remove()
            keyboardWillHideListener.remove()
        }
    },[])

    return keyboardOffsetHeight
}