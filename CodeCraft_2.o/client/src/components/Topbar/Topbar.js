import React from 'react'
import { Link } from 'react-router-dom';
import Logout from '../Buttons/Logout';
import { useSetRecoilState } from 'recoil';
import { authModalState } from '../../atoms/authModalAtom'
import { supabase } from '../../supabase/supabase';
import { useState, useEffect, useCallback } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { BsList } from 'react-icons/bs';
import Timer from '../Timer/Timer';
import { useParams } from 'react-router-dom';
import { problems } from '../../utils/problems/index'
import { useNavigate } from 'react-router-dom';


export default function Topbar({ problemPage }) {
    const [user, setUser] = useState(null);
    const setAuthModalState = useSetRecoilState(authModalState);
    let { pid } = useParams();
    const navigate = useNavigate() 

    const handleProblemChange = (isForward)=>{
        const order = problems[pid].order
        const direction = isForward? 1 : -1
        const nextProblemOrder = order + direction
        const nextProblemKey = Object.keys(problems).find((key)=> problems[key].order === nextProblemOrder)
        
        if (isForward && !nextProblemKey) {
            const firstProblemKey = Object.keys(problems).find((key) => problems[key].order === 1);
            navigate(`/problems/${firstProblemKey}`);
          } else if (!isForward && !nextProblemKey) {
            const lastProblemKey = Object.keys(problems).find((key) => problems[key].order === Object.keys(problems).length);
            navigate(`/problems/${lastProblemKey}`);
          } else {
            navigate(`/problems/${nextProblemKey}`);
          }
    }

    const openLoginModal = useCallback(() => {
        setAuthModalState((prev) => ({
            ...prev,
            isOpen: true,
            type: 'login',
        }));
    }, [setAuthModalState]);

    useEffect(() => {
        const getUserSession = async () => {
            // Get the current user's session
            const { data, error } = await supabase.auth.getSession();

            if (error) {
                console.error('Error fetching user session:', error.message);
                return null;
            }

            // Access user information from the session
            const currentUser = data?.session?.user;
            // console.log('User:', currentUser);

            setUser(currentUser);
        };

        getUserSession();
        // console.log(user)
    }, []);
    return (
        <div>
            <nav className="relative flex h-[50px] w-full shrink-0 items-center px-5 bg-dark-layer-1 text-dark-gray-7">
                <div className={`flex w-full items-center justify-between ${!problemPage ? "max-w-[1200px] mx-auto" : ""}`}>
                    <Link to="/" className="h-[22px] flex-1">
                        <img src="/logo-full.png" alt="Logo" height={100} width={100} />
                    </Link>

                    {problemPage && (
                        <div className="flex items-center gap-4 flex-1 justify-center">
                            <div
                                className="flex items-center justify-center rounded bg-dark-fill-3 hover:bg-dark-fill-2 h-8 w-8 cursor-pointer"
                              onClick={() => handleProblemChange(false)}
                            >
                                <FaChevronLeft />
                            </div>
                            <Link
                                to="/"
                                className="flex items-center gap-2 font-medium max-w-[170px] text-dark-gray-8 cursor-pointer"
                            >
                                <div>
                                    <BsList />
                                </div>
                                <p>Problem List</p>
                            </Link>
                            <div
                                className="flex items-center justify-center rounded bg-dark-fill-3 hover:bg-dark-fill-2 h-8 w-8 cursor-pointer"
                              onClick={() => handleProblemChange(true)}
                            >
                                <FaChevronRight />
                            </div>
                        </div>
                    )}

                    <div className="flex items-center space-x-4 flex-1 justify-end space-between">
                        <div className='space-x-4'>
                        <Link
                                to="/learn"
                                className="bg-dark-fill-3 py-1.5 px-3 cursor-pointer rounded text-brand-orange hover:bg-dark-fill-2">
                                Learn
                            </Link>
                            <Link
                                to="/"
                                className="bg-dark-fill-3 py-1.5 px-3 cursor-pointer rounded text-brand-orange hover:bg-dark-fill-2"
                            >
                                Premium
                            </Link>
                        </div>
                        {!user && (
                            <Link to="/auth"
                                onClick={
                                    openLoginModal
                                }
                            >
                                <button className="bg-dark-fill-3 py-1 px-2 cursor-pointer rounded ">Sign In</button>
                            </Link>
                        )}

                        {problemPage && <Timer/>}

                        {user && (
                            <div className="cursor-pointer group relative">
                                <img src="/avatar.png" alt="Avatar" width={30} height={30} className="rounded-full" />
                                <div className="absolute top-10 left-2/4 -translate-x-2/4  mx-auto bg-dark-layer-1 text-brand-orange p-2 rounded shadow-lg z-40 group-hover:scale-100 scale-0 ransition-all duration-300 ease-in-out"
                                >
                                    <p className="text-sm">{user.email}</p>
                                </div>
                            </div>
                        )}
                        {user && <Logout />}
                    </div>
                </div>
            </nav>
        </div>
    )
}