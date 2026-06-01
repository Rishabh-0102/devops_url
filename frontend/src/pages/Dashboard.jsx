import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000";

function Dashboard() {

    const [originalUrl, setOriginalUrl] = useState("");

    const [shortUrl, setShortUrl] = useState("");
    const [urls, setUrls] = useState([]);

    const handleShorten = async (e) => {

        e.preventDefault();

        try {

            const token = localStorage.getItem("token");

            const response = await axios.post(
                `${API_URL}/api/url/shorten`,

                {
                    originalUrl,
                },

                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setShortUrl(response.data.shortUrl);

            fetchUrls();
            setOriginalUrl("");
        } catch (error) {

            alert(error.response?.data?.message || "Failed to shorten URL");

        }

    };
    const fetchUrls = async () => {

        try {

            const token = localStorage.getItem("token");

            const response = await axios.get(
                `${API_URL}/api/url/myurls`,

                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setUrls(response.data);

        } catch (error) {

            console.log(error);

        }

    };
    const handleDelete = async (id) => {

        try {

            const token = localStorage.getItem("token");

            await axios.delete(
                `${API_URL}/api/url/${id}`,

                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // Refresh URLs
            fetchUrls();

        } catch (error) {

            console.log(error);

        }

    };
    useEffect(() => {

        fetchUrls();

    }, []);
    return (

        <div>

            <h2>Dashboard</h2>

            <form onSubmit={handleShorten}>

                <input
                    type="text"
                    placeholder="Enter URL"
                    value={originalUrl}
                    onChange={(e) =>
                        setOriginalUrl(e.target.value)
                    }
                    required
                />

                <br />
                <br />

                <button type="submit">
                    Shorten URL
                </button>

            </form>
            <hr />

            <h3>My URLs</h3>

            {
                urls.map((url) => (

                    <div key={url._id}>

                        <p>
                            Original: {url.originalUrl}
                        </p>

                        <p>
                            Short:
                            <a
                                href={url.shortUrl || `${API_URL}/${url.shortCode}`}
                                target="_blank"
                            >
                                {url.shortUrl || `${API_URL}/${url.shortCode}`}
                            </a>
                        </p>

                        <p>
                            Clicks: {url.clicks}
                        </p>
                        <button
                            onClick={() => handleDelete(url._id)}
                        >
                            Delete
                        </button>
                        <hr />

                    </div>

                ))
            }
            <br />

            {shortUrl && (

                <div>

                    <h3>Short URL:</h3>

                    <a
                        href={shortUrl}
                        target="_blank"
                    >
                        {shortUrl}
                    </a>

                </div>

            )}

        </div>

    );

}

export default Dashboard;