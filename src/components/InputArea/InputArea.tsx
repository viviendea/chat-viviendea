export const InputArea = () => {
    return (
        <div className="h-[150px] w-full p-4 sticky bottom-0 left-0 right-0 bg-white border-t border-gray-300 flex ">
            <textarea
                className=" text-start border-principal w-full h-full p-2 border rounded-lg text-sm"
                placeholder="Escribe un mensaje..."
                id="w3review"
                name="w3review"
                rows="4"
                cols="50"
            >
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Atque
                non excepturi sit perspiciatis praesentium eius nihil. Ratione,
                ipsam quae. Natus rem delectus dolores, consequatur quod rerum
                iusto odit excepturi repellendus!
            </textarea>

            <button className="bg-gray-300 text-gray-600 rounded-4xl hover:bg-blue-600 transition-colors w-[40px] h-[40px] flex items-center justify-center ml-2 self-end">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    className="bi bi-send w-[20px] h-[20px] flex items-center justify-center"
                    viewBox="0 0 20 20"
                >
                    <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576zm6.787-8.201L1.591 6.602l4.339 2.76z" />
                </svg>
            </button>
        </div>
    );
};
