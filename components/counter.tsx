"use client";

import { useState } from "react";
import { Button } from "@heroui/button";

export const Counter = ({ initialCount, children} : {initialCount: number ,children : React.ReactNode}) => {
  const [count, setCount] = useState(initialCount);

  return (
   <>
    <Button radius="full" onPress={() => setCount(count + 1)}>
        Count is {count}
    </Button>
    {children}
   </>
   
  );
};
