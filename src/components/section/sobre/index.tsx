

import Image from "next/image"
import img from "../../../img/img_sess/img-site-nos.jpg"
export default function Sobre() {
    return (
        <div className="flex justify-center mt-[100px]  " >
            <div className="max-w-[1140px] w-full">

                <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-[50px] m-auto mx-[40px]">
                    <div className="order-2 md:order-1">
                        <h2 className="text-[30px] font-[600]">Lorem ipsum dolor sit amet,</h2>
                        <p className="text-[18px] mt-[15px]">
                            Lorem e alifwfawaffaqugeam. Lfgrgrorem ipsum dolor sit amet consectetur adipisicinarchitece nemo provident officiis cumque ex quidem enim cum blanditiis possimus commodi! elit. Accusantium at eum doloremque sapiente voluptatum assumenda, quidem accusamus. Nemo perspiciatis illum quam eum expedita doloribus aperiam? Accusantium laudantium ad assumenda iure....
                        </p>
                      
                    </div>

                    <div className="w-full order-1 md:order-2 flex justify-center">
                        <Image
                            src={img}
                            alt="text"
                            width={500}
                        />
                    </div>
                </div>

            </div>


        </div>
    )
}