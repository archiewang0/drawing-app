import React from 'react';

const Container = ({children}: {children: React.ReactNode}) => {
    return (
        <div className="flex py-32 justify-center min-h-screen bg-gray-100">
            <div className=" container">{children}</div>
        </div>
    );
};

export default Container;
