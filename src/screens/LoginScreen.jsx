import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import Button from '../components/Button'
import API from '../services/api'

export default function LoginScreen() {
  const { login } = useAuth()
  const [isRegister, setIsRegister] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Forgiving Format: If they type 'KEBO', turn it into 'kebo@ecosnap.com'
    const formattedEmail = email.includes('@') ? email.toLowerCase() : `${email.toLowerCase().replace(/\s/g, '')}@ecosnap.com`;
    const finalUsername  = username || email.split('@')[0];

    try {
      if (isRegister) {
        await API.post('/auth/register', { email: formattedEmail, password, username: finalUsername })
        await login(formattedEmail, password)
      } else {
        await login(formattedEmail, password)
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Authentication failed. Check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 screen-enter">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center space-y-2">
          <span className="material-symbols-outlined text-6xl text-[#a8d0b4]" style={{ fontVariationSettings: "'FILL' 1" }}>
            eco
          </span>
          <h1 className="text-4xl font-black tracking-tight text-[#a8d0b4]">EcoSnap</h1>
          <p className="text-[#98a093] text-sm italic">"{isRegister ? 'Join the movement' : 'Let\'s clean up together'}"</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <input
              type="text"
              placeholder="Display Name (e.g. Elena Vance)"
              className="w-full bg-[#020617] border border-[#32457c]/15 p-4 rounded-xl text-white outline-none focus:border-[#a8d0b4]/40 transition-all"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          )}
          <input
            type="email"
            placeholder="Email address"
            className="w-full bg-[#020617] border border-[#32457c]/15 p-4 rounded-xl text-white outline-none focus:border-[#a8d0b4]/40 transition-all"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full bg-[#020617] border border-[#32457c]/15 p-4 rounded-xl text-white outline-none focus:border-[#a8d0b4]/40 transition-all"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          
          {error && <p className="text-[#ee7d77] text-[10px] text-center uppercase tracking-wider">{error}</p>}
          
          <div className="pt-2">
            <Button variant="primary">
              {loading ? 'Processing...' : (isRegister ? 'Create Account' : 'Log In')}
            </Button>
          </div>
        </form>

        <div className="text-center space-y-4">
          <button 
            onClick={() => setIsRegister(!isRegister)}
            className="text-[#98a093] text-xs hover:text-[#a8d0b4] transition-colors"
          >
            {isRegister ? 'Already have an account? Log In' : 'Need an account? Sign Up'}
          </button>
          
          <p className="text-[#98a093] text-[10px] uppercase tracking-[0.2em] leading-loose opacity-40">
            Powered by Gemini AI • Circular Economy
          </p>
        </div>
      </div>
    </div>
  )
}
