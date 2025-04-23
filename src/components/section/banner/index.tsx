'use client'
import Image from "next/image"
import img from "../../../img/img_sess/2885174.jpg"

export default function Banner() {
    return (
        <div className="flex justify-center py-[60px] h-full">

            <div className=" flex items-center justify-center ">
                <div className="max-w-[1140px] w-full grid grid-cols-1 md:grid-cols-2 items-center gap-[50px] m-auto mx-[40px] ">
                    <div className="flex justify-center  w-full" >
                        <Image
                            src={img}
                            alt="texto"

                        />
                    </div>
                    <div className="text-[30px] font-[600] text-black w-full ">
                        <h1 className="animate-fade-left animate-once animate-duration-[800ms] animate-delay-200 animate-ease-out animate-normal animate-fill-forwards" >Lorem  doloripsum dolor <br /> sit  dolor amet</h1>
                        <p className="text-[18px] font-[500] mt-4">
                            Lorem ipsum dolor sit, amet consectetur Lorem, ipsum dolor sie exercitationem cupiditate blanditiis magnam aliquam velit maiores alias iure eius, consequuntur libero. adipisicing elit. Quas minima, repudiandae, aspernatur fugit cum recusandae suscipit laboriosam aliquam libero doloremque ad ipsa sit necessitatibus id molestias! Perferendis quis saepe officia?
                        </p>

                        <button className="bg-[#01A1FF] text-white px-[53px] py-[10px] text-[20px] rounded-[9px] cursor-pointer mt-[20px]  hover:scale-105 transition-transform duration-300">Lorem</button>
                    </div>



                </div>
            </div>

        </div>

    )
}